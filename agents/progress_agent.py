from memory.long_term import get_progress, get_mistake_stats

def progress_agent(user_id):
    progress = get_progress(user_id)
    stats = get_mistake_stats(user_id)

    return {
        "progress": progress,
        "mistakes": stats
    }